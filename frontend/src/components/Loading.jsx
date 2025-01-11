const Loading = ({ size = 200 }) => {
  const d = size / 5; // Derive the value for --d based on size

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999, // Ensure it's on top of everything
        backgroundColor: "white",
        margin: "0", // Reset margin if necessary
      }}
    >
      <div
        style={{
          width: `${d / 5}px`,
          height: `${d / 5}px`,
          borderRadius: "50%",
          color: "#25b09b",
          boxShadow: `
            ${1 * d}px ${0 * d}px 0 0,
            ${0.707 * d}px ${0.707 * d}px 0 1px,
            ${0 * d}px ${1 * d}px 0 2px,
            ${-0.707 * d}px ${0.707 * d}px 0 3px,
            ${-1 * d}px ${0 * d}px 0 4px,
            ${-0.707 * d}px ${-0.707 * d}px 0 5px,
            ${0 * d}px ${-1 * d}px 0 6px
          `,
          animation: "l27 1s infinite steps(8)",
        }}
      />
      <style>
        {`
          @keyframes l27 {
            100% { transform: rotate(1turn); }
          }
        `}
      </style>
    </div>
  );
};

export default Loading;
