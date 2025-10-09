import { toast } from "react-toastify";

const showToast = (type, message) => {
  const content = (
    <div>
      {message.split("\n").map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  );

  const options = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  toast[type](content, options);
};

export const showToastSuccess = (msg) => showToast("success", msg);
export const showToastWarning = (msg) => showToast("warning", msg);
export const showToastError = (msg) => showToast("error", msg);