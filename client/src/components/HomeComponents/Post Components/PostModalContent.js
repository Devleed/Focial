import React from 'react';
import { Icon } from 'semantic-ui-react';

import PostFileField from './PostFileField';

/**
 * MAIN COMPONENT
 * - responsible for displaying modal content for a post
 * - used in creation and editing
 */
const PostModalContent = ({
  previewImage,
  value,
  setValue,
  setFiles,
  setPreviewImage,
  files,
  showExtraButtons,
}) => {
  return (
    <div className="create_info">
      <textarea
        className="create_post-field"
        placeholder="What's on your mind? James"
        rows={previewImage ? '1' : '8'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus={true}
      ></textarea>
      {previewImage ? (
        <div className="image_preview">
          <button
            onClick={(e) => {
              setFiles([]);
              setPreviewImage(null);
            }}
          >
            <Icon name="times" />
          </button>
          <img src={previewImage} />
        </div>
      ) : null}
      {showExtraButtons ? (
        <div className="extra_options">
          <PostFileField
            files={files}
            onFileSelect={setFiles}
            setPreview={setPreviewImage}
          >
            <span>
              <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/6C1aT2Hm3x-.png" />
              <p>Photo / video</p>
            </span>
          </PostFileField>
          <span>
            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y1/r/B2DvHIwPOij.png" />
            <p>Tag People</p>
          </span>
          <span>
            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/I9uaowma2QB.png" />
            <p>Feelings</p>
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default PostModalContent;
