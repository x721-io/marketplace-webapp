import MainLayout from "@/components/Layout/MainLayout";
import "@rainbow-me/rainbowkit/styles.css";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
