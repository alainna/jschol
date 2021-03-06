// ##### AdminBar Component ##### //

import React from 'react'
import { Subscriber } from 'react-broadcast'
import MEDIA_PATH from '../../js/MediaPath.js'

const AdminBarComp = (props) =>
  <Subscriber channel="cms">
    { cms =>
      <div style={{ marginTop: (cms.permissions && cms.permissions.admin && cms.modules) ? "-20px" : "-10px" }}>
        { cms.loggedIn &&
          <div className="c-adminbar">
            <div className="c-adminbar__edit-pg">
          {(cms.permissions && cms.permissions.admin && cms.modules) ?
            <button className="c-adminbar__edit-pg-button" onClick={e => cms.onEditingPageChange(!cms.isEditingPage)}>
              {cms.isEditingPage ? "Done editing" : "Edit page"}
            </button>
          :
            <button className="c-adminbar__edit-pg-button" disabled={true}>Edit page</button>
          }
              <a href="https://help.escholarship.org/support/solutions/articles/9000124100-using-the-site-editing-tool"><img className="c-adminbar-help__icon" src={MEDIA_PATH + 'icon_help-white.svg'} alt="Get help on content carousels" /></a>
            </div>
            <div className="c-adminbar__logged-in-msg">
              Logged in as '{cms.username}'
            </div>
          </div>
        }
      </div>
    }
  </Subscriber>

module.exports = AdminBarComp;
