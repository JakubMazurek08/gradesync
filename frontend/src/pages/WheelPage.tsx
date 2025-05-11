import { useState, useEffect } from "react";
import { WheelGame } from '../components/wheelPage/WheelGame.tsx';
import { WheelAdd } from "../components/wheelPage/WheelAdd.tsx";
import { WheelDelete } from "../components/wheelPage/WheelDelete.tsx";
import { WheelPatch } from "../components/wheelPage/WheelPatch.tsx";
import { WheelPut } from "../components/wheelPage/WheelPut.tsx";

export const WheelPage = () => {
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3000/wheel/");
                if (!response.ok) throw new Error("Failed to fetch data");

                const result = await response.json();
                const fullNames = result.result.map((item) => ({
                    first_name: item.first_name,
                    last_name: item.last_name,
                }));
                setData(fullNames);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch data");
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {(() => {
                if (error) {
                    return <p>Error: {error}</p>;
                }

                if (data) {
                    if (data.length > 0) {
                        return (
                            <div>
                                <WheelGame data={data} />
                                <div class="ml-2 text-white">
                                    <h2>Students: </h2>
                                    {data.map((item) => (
                                        <li key={item}>
                                            {item.first_name} {item.last_name}
                                        </li>
                                    ))}<br/>
                                    <WheelAdd/><br />
                                    <WheelDelete/><br />
                                    <WheelPatch/><br />
                                    <WheelPut/>
                                </div>
                            </div>
                        );
                    } else {
                        return <p>No data available...</p>;
                    }
                }
                return null;
            })()}
        </div>
    );
};