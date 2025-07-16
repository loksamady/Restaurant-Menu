export const getColor = (status: string) => {
  let color = "grey";
  switch (status) {
    case "green":
      color = "text-green-400";
      break;
    case "red":
      color = "text-red-400";
      break;
    case "grey":
      color = "text-grey-400";
      break;
    default:
      color = "text-grey-400";
      break;
  }
  return color;
};

export const getChangeIcon = (status: string) => {
  let icon = "pi pi-sort-up-fill";

  switch (status) {
    case "up":
      icon = "pi pi-sort-up-fill";
      break;
    case "down":
      icon = "pi pi-sort-down-fill";
      break;
    case "equal":
      icon = "";
      break;
    default:
      icon = "";
      break;
  }

  return icon;
};

export const getChangeColor = (status: string) => {
  let color = "grey";

  switch (status) {
    case "up":
      color = "text-green-500";
      break;
    case "down":
      color = "text-red-500";
      break;
    case "equal":
      color = "text-grey-500";
      break;
    default:
      color = "text-grey-500";
      break;
  }

  return color;
};

export const getChangeBorderLeftColor = (status: string) => {
  let border = "border-l-green-500";

  switch (status) {
    case "up":
      border = "border-l-green-500";
      break;
    case "down":
      border = "border-l-red-500";
      break;
    case "equal":
      border = "border-l-grey-500";
      break;
    default:
      border = "border-l-grey-500";
      break;
  }

  return border;
};
