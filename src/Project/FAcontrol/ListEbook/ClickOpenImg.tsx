import React, { useState } from 'react';
import { Dialog, DialogContent, IconButton, ImageListItem, ImageListItemBar } from '@mui/material';
import FilePresentIcon from '@mui/icons-material/FilePresent';

// Create a separate component for rendering the image cell
const ImageCell = ({ imagePath, name, code }: { imagePath: string; name: string; code: string }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleClickOpen = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedImage(null);
  };

  return (
    <>
      <ImageListItem key={imagePath}>
        <img
          src={`${imagePath}?w=248&fit=crop&auto=format`}
          srcSet={`${imagePath}?w=248&fit=crop&auto=format&dpr=2 2x`}
          alt={name}
          style={{ height: 140, objectFit: 'cover', cursor: 'pointer' }}
          onClick={() => handleClickOpen(imagePath)}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = "http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_230400022.jpg";
          }}
          loading="lazy"
        />
      </ImageListItem>

      {/* Dialog for displaying the image */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        fullWidth
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogContent style={{ textAlign: 'center' }}>
          <img
            src={selectedImage || ''}
            alt={name}
            style={{ width: '100%', height: 'auto', maxWidth: '600px', maxHeight: '80vh' }}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = "http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_230400022.jpg";
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageCell;
