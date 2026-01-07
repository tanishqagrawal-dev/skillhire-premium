import { Radar } from "react-chartjs-2";
export default function SkillRadar() {
  const data = {
    labels:["DSA","System Design","Backend","Projects"],
    datasets:[{data:[65,40,55,70]}]
  };
  return (
    <section style={{padding:"120px 0"}}>
      <Radar data={data}/>
    </section>
  );
}
