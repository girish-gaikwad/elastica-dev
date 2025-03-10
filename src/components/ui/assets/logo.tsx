import Text from "@/components/ui/text";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image src="/elastica.png" width={32} height={32} alt="Elastica Logo" className="w-10 h-10 mr-2" />
      <Text family="poppins" weight={500} className="md:text-3xl">
        Elastica
        {/* <span className="text-[#6C7275]">.</span> */}
      </Text>
    </div>
  );
}
