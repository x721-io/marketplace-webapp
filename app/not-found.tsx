import Link from "next/link";

import Icon from "@/components/Icon";
import Button from "@/components/Button";

export default function NotFound() {
  return (
    <div className="h-screen w-full  flex flex-col justify-center items-center gap-6">
      <div className="text-center">
        <h1 className="text-3xl mb-2">Looks like you’re lost</h1>
        <p className="text-base text-gray-500">
          Sorry, we couldn’t find the page you’re looking for
        </p>
      </div>

      <Link
        href="/"
        className="w-full flex flex-col justify-center items-center"
      >
        <Button scale="lg" className="w-full max-w-[200px]">
          back to home
        </Button>
      </Link>
    </div>
  );
}
