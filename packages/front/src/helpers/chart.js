export const colorForIndex = index => {
  const barColors = ["#247ba0", "#70c1b3", "#b2dbbf"];
  return barColors[index % barColors.length];
};
