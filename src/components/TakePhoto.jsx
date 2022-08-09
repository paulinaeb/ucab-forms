import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { Photo as TakeAPhoto } from "@mui/icons-material";
import React from "react";
import Webcam from "react-webcam";

const TakePhoto = ({ inputId, getPicture, disabled }) => {
  const id = "taken-photo" + inputId;

  const [openTakePicture, setOpenTakePicture] = useState(false);

  const webcamRef = React.useRef(null);

  var imageSrc = null;

  const handleClose = () => {
    setOpenTakePicture(false);
  };

  const handleClickTakePicture = () => {
    setOpenTakePicture(true);
  };

  function capture() {
    imageSrc = webcamRef.current.getScreenshot();

    handleClose();
    getPicture = { imageSrc };
  }

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  return (
    <label htmlFor={id}>
      <input
        style={{ display: "none" }}
        id={id}
        type="file"
        disabled={true}
        onChange={(e) => {
          e.target.insertAdjacentElement(e.target.files, imageSrc);
          console.log(e.target.files.length);
        }}
      />
      <Button
        disabled={disabled}
        style={{ margin: 10 }}
        variant="contained"
        startIcon={<TakeAPhoto />}
        component="span"
        onClick={handleClickTakePicture}
      >
        Tomar foto
      </Button>
      <Dialog
        open={openTakePicture}
        onClose={handleClose}
        fullWidth={false}
        maxWidth="dm"
      >
        <DialogTitle>Tomar una foto</DialogTitle>
        <DialogContent>
          <Webcam
            audio={false}
            mirrored={true}
            height={480}
            ref={webcamRef}
            screenshotFormat={id + "/jpeg"}
            width={640}
            videoConstraints={videoConstraints}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={capture}>Tomar foto</Button>
          <Button onClick={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </label>
  );
};

export default TakePhoto;
