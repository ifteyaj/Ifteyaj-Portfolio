import { LogoCloud } from "@/components/ui/logo-cloud-2";

export default function LogoCloudDemo() {
  return (
    <div className="grid min-h-screen w-full place-content-center bg-black px-4">
      <section className="relative mx-auto grid w-full max-w-3xl">
        <h2 className="mb-6 text-center text-lg font-medium tracking-tight text-muted-foreground md:text-2xl">
          Companies we <span className="font-semibold text-primary">collaborate</span> with.
        </h2>

        <LogoCloud />
      </section>
    </div>
  );
}