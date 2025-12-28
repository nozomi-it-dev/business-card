import html2canvas from "html2canvas";

export const downloadCard = async (element, formData) => {
  if (!element) {
    throw new Error("Element not found");
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      imageTimeout: 0,
    });

    const position = formData.position || "NoPosition";
    const fullNameEn = formData.full_name_en || "Unnamed";
    const fileName = `Nozomi-${position}-${fullNameEn}.png`;

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error("Failed to create image blob");
        }

        if (navigator.share && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
          const file = new File([blob], fileName, { type: "image/png" });
          navigator
            .share({
              files: [file],
              title: "Business Card",
            })
            .catch((error) => {
              downloadBlob(blob, fileName);
            });
        } else {
          downloadBlob(blob, fileName);
        }
      },
      "image/png",
      1.0
    );
  } catch (error) {
    console.error("Error downloading card:", error);
    throw error;
  }
};

const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
