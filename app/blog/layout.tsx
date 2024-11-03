import Hero from "@/app/_components/Hero";
import Sheet from "@/app/_components/Sheet";

type Props = {
  children: React.ReactNode;
};

export default function NewsLayout({ children }: Props) {
  return (
    <>
      <Hero title="BLOG" sub="ブログ" />
      <Sheet>{children}</Sheet>
    </>
  );
}
