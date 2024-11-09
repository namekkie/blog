import Sheet from "@/app/_components/Sheet";

type Props = {
  children: React.ReactNode;
};

export default function NewsLayout({ children }: Props) {
  return (
    <>
      <Sheet>{children}</Sheet>
    </>
  );
}
