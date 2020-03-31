import React, { useState } from 'react';
import { Field, reduxForm } from 'redux-form';
import { useDispatch } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { editPost, calculateDate } from '../../../helpers';
import Modal from '../Modal';
import { NavLink } from 'react-router-dom';

const PostBody = ({ post }) => {
  let shared,
    image,
    body = post.body;

  const textStyle = {
    fontSize: '24px'
  };

  if (post.date_shared) {
    shared = true;
    textStyle.fontSize = '12px';
    if (post.post) {
      body = post.post.body;
      if (post.post.post_image || post.post.body.length > 200) {
        image = post.post.post_image;
      }
    }
  } else if (post.post_image || post.body.length > 200) {
    image = post.post_image;
    textStyle.fontSize = '12px';
  }

  const renderShareInfo = () => {
    if (shared) {
      return (
        <div
          className="share_info"
          style={{
            borderTop: image ? 'none' : '1px solid var(--extra)'
          }}
        >
          {!post.post ? (
            <React.Fragment>
              <h3>This post was deleted</h3>
              <p>
                for any inconvenience do report us at{' '}
                <a href="google.com" target="_black">
                  Google
                </a>
              </p>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="post_head" style={{ padding: 0 }}>
                {image ? null : (
                  <img
                    className="small-picture-post"
                    src={post.post.author.profile_picture}
                  />
                )}
                <div className="post_meta" style={{ margin: 0 }}>
                  <strong>
                    <NavLink to={`/user/${post.post.author._id}`}>
                      {post.post.author.name}
                    </NavLink>
                  </strong>
                  <br />
                  <span>{calculateDate(post.post.date_created)}</span>
                </div>
              </div>
              <div className="share_body">{body}</div>
            </React.Fragment>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <React.Fragment>
      <div className="post_body">
        <div className="post_content">
          <p style={textStyle}>{shared ? post.content : post.body}</p>
        </div>
        {image ? <img src={image.url} className="post_image" /> : null}
      </div>
      {renderShareInfo()}
    </React.Fragment>
  );
};

export default reduxForm({ form: 'post edit form' })(PostBody);
