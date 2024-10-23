import "./maintenance.css";

export default function MaintenanceBanner() {
  return (
    <div className="w-screen h-screen top-0 left-0 fixed z-[10000] bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
    <div className="container w-[800px] aspect-video rounded-2xl shadow-xl max-[800px]:w-[90%] max-[800px]:aspect-square">
      <div className="vh">
        <div>
          <div className="wrap">
            <h1>Maintenance mode</h1>
            <h2>
              <p>
                Sorry for the inconvenience.
                <br />
                Our website is currently undergoing scheduled maintenance.
                <br />
                <br />
              </p>
            </h2>
            <p>Thank you for your understanding.</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
