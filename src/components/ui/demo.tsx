import TopoField from "@/components/ui/topo-field";

export default function TopoFieldDemo() {
  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-xl bg-neutral-950 border border-neutral-900">
      <TopoField className="absolute inset-0" mode="dark" />
      <div className="relative z-10 flex h-full w-full items-center justify-center px-8">
        <p className="text-center text-3xl md:text-5xl font-extralight tracking-tight text-neutral-200 leading-tight max-w-2xl">
          Animated topographic background
        </p>
      </div>
    </div>
  );
}
