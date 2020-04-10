import React from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

const renderBody = (text, data) => {
  let urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((t, index) => {
    if (!t.match(urlRegex)) return null;
    return (
      <a key={index} href={t} target="_blank" style={{ color: '#008ecc' }}>
        {data ? (
          <div className="scraped_data">
            <img src={data[0].image} alt={`${data[0].title} image`} />
            <div>
              <h1>{data[0].title}</h1>
              <span>{data[0].url}</span>
              <p>{data[0].description}</p>
            </div>
          </div>
        ) : (
          t
        )}
      </a>
    );
  });
};

const PostBody = ({ post }) => {
  let shared,
    image,
    body = post.body;

  const textStyle = {
    fontSize: '24px',
  };

  if (post.date_shared) {
    shared = true;
    textStyle.fontSize = '12px';
    body = post.post.body;
    if (post.post.post_image) image = post.post.post_image;
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
            borderTop: image ? 'none' : '1px solid var(--extra)',
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
                  <span>{moment(post.post.date_created).fromNow()}</span>
                </div>
              </div>
              <div className="share_body">
                {renderBody(body, post.scrapedData)}
              </div>
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
          <div style={textStyle}>{renderBody(post.body, post.scrapedData)}</div>
        </div>
        {image ? <img src={image.url} className="post_image" /> : null}
      </div>
      {renderShareInfo()}
    </React.Fragment>
  );
};

export default PostBody;
