export function AddForm(props: {
  onSubmit: () => Promise<unknown>;
  loading: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void props.onSubmit();
      }}
      className="flex flex-col gap-4 border border-zinc-300 rounded-md max-w-sm p-4"
    >
      <h2 className="text-zinc-600 text-2xl">New functionality name</h2>
      <input
        type="text"
        placeholder="Name"
        value={props.value}
        onChange={props.onChange}
        className="border border-blue-400 p-2 rounded-xl"
      />
      <button
        className="bg-blue-400 px-4 py-2 rounded-xl text-white "
        type="submit"
      >
        {props.loading ? "Loading" : "Add"}
      </button>
    </form>
  );
}
