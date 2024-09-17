import { currentUser } from "@clerk/nextjs/server";

export default async function HomePage() {
  const user = await currentUser();

  return (
    <main className="flex flex-col items-center justify-center bg-gray-300 text-black">
      <div className="container flex min-h-screen max-w-full gap-6 px-6 py-4">
        <div className="flex w-1/4 gap-2 border border-white/20 bg-white text-black">
          <div className="flex w-1/6 rounded-3xl border border-white/20 bg-red-400 text-black"></div>

          <div className="flex w-5/6 rounded-3xl border border-white/20 bg-red-400 text-black">
            <div>Hello {user?.}</div>
          </div>
        </div>

        <div className="flex w-2/4 rounded-3xl border border-white/20 bg-white text-black"></div>
        <div className="flex w-1/4 rounded-3xl border border-white/20 bg-white text-black">
          <div></div>
        </div>
      </div>
    </main>
  );
}
