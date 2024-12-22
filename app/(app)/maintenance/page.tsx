import Icon from "@/components/Icon";

export default function MaintenancePage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-surface-soft">
      <div className="max-w-[450px] tablet:max-w-full w-full flex flex-col justify-center items-center h-screen gap-6">
        <Icon name="maintenance" width={50} height={50} />
        <div>
          <p className="text-body-32 tablet:text-[70px] text-center pb-2 tablet:pb-10">
            We’re under maintenance
          </p>
          <p className="text-base tablet:text-body-32 text-center text-gray-500">
            X721 will automatically resume running after maintenance is
            completed. We apologize for this inconvenience.
          </p>
        </div>
      </div>
    </div>
  );
}
