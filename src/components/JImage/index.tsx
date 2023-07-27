import { memo, useState } from 'react';

import { Image, ImageViewer, ImageProps, ImageViewerProps } from 'antd-mobile';

interface Props extends ImageProps {
  imageViewProps?: ImageViewerProps;
  disabled?: boolean;
}

const Index: React.FC<Props> = (props) => {
  const { imageViewProps, disabled = true, ...attr } = props;
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Image
        onClick={() => {
          setVisible(true);
        }}
        {...attr}
      ></Image>
      {!disabled && (
        <ImageViewer
          image={attr.src}
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
          {...imageViewProps}
        />
      )}
    </>
  );
};

export default memo(Index);
