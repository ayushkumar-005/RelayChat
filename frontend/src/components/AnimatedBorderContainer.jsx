const AnimatedBorderContainer = ({ children }) => {
    return (
        <div
            className="w-full h-full 
      rounded-3xl 
      border border-transparent 
      flex overflow-hidden
      [background:linear-gradient(#0f172a,#0f172a)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.800)_80%,_theme(colors.orange.500)_86%,_theme(colors.amber.300)_90%,_theme(colors.orange.500)_94%,_theme(colors.slate.800))_border-box]
      animate-border
    "
        >
            {children}
        </div>
    );
};

export default AnimatedBorderContainer;
