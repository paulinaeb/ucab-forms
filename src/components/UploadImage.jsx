import { Button } from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";

function validarFile(e) {
  var allowedExtensions = [".png", ".jpg", ".jpeg"];

  var itemLoad = e.target.value;
  var lastPoint = e.target.value.lastIndexOf(".");
  var extension = itemLoad.slice(lastPoint, itemLoad.length);

  if (allowedExtensions.indexOf(extension) === -1) {
    return false; // Si la extension es no válida ya no chequeo lo de abajo.
  } else {
    return true;
  }
}

const UploadImage = ({ inputId, onChange, multiple, disabled }) => {
  const id = "upload-image" + inputId;

  return (
    <label htmlFor={id}>
      <input
        style={{ display: "none" }}
        id={id}
        multiple={multiple}
        type="file"
        disabled={disabled}
        onChange={(e) => {
          console.log(e.target.files);
          if (e.target.files.length) {
            console.log(e.target.files.length);
            if (validarFile(e) === true) {
              onChange(e.target.files);
            }
          }
        }}
      />
      <Button
        disabled={disabled}
        style={{ margin: 10 }}
        variant="contained"
        startIcon={<UploadIcon />}
        component="span"
      >
        Cargar imagen{multiple ? "s" : ""}
      </Button>
    </label>
  );
};

export default UploadImage;
