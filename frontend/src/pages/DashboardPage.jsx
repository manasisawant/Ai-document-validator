import DashboardCards from "../components/DashboardCards";
import UploadSection from "../components/UploadSection";
import Loading from "../components/Loading";

function DashboardPage() {
  return (
    <>
      <DashboardCards />
      <UploadSection />
      <Loading />
    </>
  );
}

export default DashboardPage;