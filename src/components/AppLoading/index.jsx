import { ColorRing } from "react-loader-spinner";

function AppLoading() {
  return (
    <div style={{ textAlign: "center" }}>
      <ColorRing visible height={80} width={80} colors={["#398aa5"]} />
    </div>
  );
}

export default AppLoading;
