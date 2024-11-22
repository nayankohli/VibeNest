const Loading = ({ size = 200 }) => {
    const d = size / 5; // Derive the value for --d based on size
  
    return (
      <div
        style={{
          width: "80%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position :"fixed",
          zIndex:1,
        //   backgroundColor:"white",
        //   padding:"200px",
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
            justifyContent: "center",
          alignItems: "center",
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
  