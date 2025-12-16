"use client";

interface ResponseBoxProps {
  response: any;
  isError?: boolean;
}

export default function ResponseBox({
  response,
  isError = false,
}: ResponseBoxProps) {
  const formatResponse = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="bg-[#1e1e1e] text-[#d4d4d4] p-5 rounded-lg mt-5 font-mono text-sm overflow-x-auto whitespace-pre-wrap min-h-[100px]">
      <span className={isError ? "text-red-400" : "text-green-400"}>
        {response ? formatResponse(response) : "Response will appear here..."}
      </span>
    </div>
  );
}
