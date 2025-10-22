import { Footer } from "@/components/footer";
import UploadImageToCAD from "@/components/promptToCAD/UploadPromptToCAD";
import { Navbar } from "@/components/navbar";

const ImageToCAD = () => {
  return (
    <>
      <Navbar />
      <UploadImageToCAD />
      <Footer />
    </>
  );
};

export default ImageToCAD;
