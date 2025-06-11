export const hoverScaleMui = (scale: number = 1.1) => ({
  transition: 'transform 0.1s ease-in-out',
  '&:hover , .group:hover &, &:focus, .group:focus': {
    transform: `scale(${scale})`,
  },
})
