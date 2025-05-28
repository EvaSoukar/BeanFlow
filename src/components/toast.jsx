export const Toast = ({ message }) => {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3E3E3E] text-[#6BA368] px-10 py-6 font-bold text-xl rounded-xl shadow-lg z-50 animate-fade-in-out text-center">
      { message }
    </div>  )
}