import React from 'react';
import { Placeholder, Segment } from 'semantic-ui-react';

/**
 * MAIN COMPONENT
 * - responsible for displaying placeholder for post
 */
const PostPlaceholder = () => {
  return (
    <Segment
      style={{
        padding: '40px 20px',
        position: 'relative',
        top: '0',
        right: '0',
        zIndex: '0',
      }}
      inverted
    >
      <Placeholder inverted>
        <Placeholder.Header image>
          <Placeholder.Line length="short" />
          <Placeholder.Line length="very short" />
        </Placeholder.Header>
        <Placeholder.Paragraph>
          <Placeholder.Line length="long" />
          <Placeholder.Line length="short" />
          <Placeholder.Line length="medium" />
        </Placeholder.Paragraph>
      </Placeholder>
    </Segment>
  );
};

export default PostPlaceholder;
