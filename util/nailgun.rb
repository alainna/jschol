
# Utility for starting, stopping, and using nailgun to efficiently run a
# Java program (e.g. Saxon) many times in a row.

require 'open3'

##################################################################################
class Nailgun

  # Very simple usage that takes advantage of Ruby's blocks:
  #
  # Nailgun.run { |ng|
  #     ng.transform(xslFile, inFile, outFile) # Saxon transform to file
  #     # or
  #     ng.call([param1,param2,...])           # call, return output as string
  # }

  def self.run(classPath, port = 0, &blk)
    inst = Nailgun.new
    inst.runInternal(classPath, port, &blk)
  end

  def runInternal(classPath, port = 0, &blk)

    # If no port specified, let the O/S pick one.
    if port == 0
      socket = Socket.new(:INET, :STREAM, 0)
      socket.bind(Addrinfo.tcp("127.0.0.1", 0))
      @port = socket.local_address.ip_port
      socket.close
    end

    fullClassPath = "/apps/eschol/erep/xtf/control/xsl/nailgun.jar:#{classPath}"
    cmd = "java -cp #{fullClassPath} -server com.martiansoftware.nailgun.NGServer #{@port} > nailgun.log 2>&1"
    pid = spawn(cmd)

    # Wait for it to warm up
    begin
      retries ||= 0
      callInternal(true, "ng-version")
    rescue Exception => e
      sleep 0.1
      retry if (retries += 1) < 100
      raise("Nailgun failed to start within 10 seconds.")
    end

    # Run the block
    begin
      blk.yield(self)
    ensure
      # Tell nailgun to shut down
      begin
        callInternal(true, "ng-stop")
      rescue
        # ignore errors during stop
      end

      # And wait for the shutdown
      status = Process.wait2(pid)[1]
      status == 0 or raise("Nailgun command failed with code #{status}")
    end
  end

  def callInternal(eatOutput, argStr)
    # Do the transform
    cmd = "ng --nailgun-port #{@port} #{argStr}"
    #puts cmd
    stdout, stderr, status = Open3.capture3(cmd)
    eatOutput or print stderr
    if not status.success?
      eatOutput or print stdout
      raise("Command #{cmd.inspect} failed with code #{status.exitstatus}")
    end
    return stdout
  end

  def call(javaClass, *args)
    callInternal(false, ([javaClass] + args).join(" "))
  end
end