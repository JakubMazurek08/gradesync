import Phaser from "phaser";
import { useEffect, useRef } from "react";

type WheelGameProps = {
    data: Array<{ first_name: string; last_name: string }>;
};

export const WheelGame = ({ data }: WheelGameProps) => {
    const gameRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let game: Phaser.Game;
        let wheelContainer: Phaser.GameObjects.Container;
        let canSpin: boolean;
        const slices = data.length;
        const slicesData = data.map(item => `${item.first_name} ${item.last_name}`); // Łączenie imion i nazwisk
        const radius = 200;
        let name: number;
        let chosenName: Phaser.GameObjects.Text;

        class PlayGame extends Phaser.Scene {
            constructor() {
                super({ key: "PlayGame" });
            }

            create() {
                // Ustawienie tła sceny
                this.cameras.main.setBackgroundColor("#1A1A1A");

                // Kontener koła
                wheelContainer = this.add.container(
                    this.cameras.main.centerX,
                    this.cameras.main.centerY
                );

                // Tworzenie segmentów koła
                for (let i = 0; i < slices; i++) {
                    const startAngle = (2 * Math.PI * i) / slices;
                    const endAngle = (2 * Math.PI * (i + 1)) / slices;

                    const segment = this.add.graphics();

                    if(i % 2 === 0){
                        segment.fillStyle(0x2D0983, 1)
                    }
                    else{
                        segment.fillStyle(0x6817C5, 1)
                    }

                    segment.beginPath();
                    segment.moveTo(0, 0);
                    segment.arc(0, 0, radius, startAngle, endAngle, false);
                    segment.lineTo(0, 0);
                    segment.closePath();
                    segment.fill();

                    wheelContainer.add(segment);

                    // Napisy na segmentach
                    const textAngle = startAngle + (endAngle - startAngle) / 2;
                    const textX = Math.cos(textAngle) * radius * 0.5;
                    const textY = Math.sin(textAngle) * radius * 0.5;
                    const text = this.add.text(textX, textY, slicesData[i], {
                        font: "16px Arial",
                        color: "#ffffff",
                        align: "center",
                    });
                    text.setOrigin(0.5).setRotation(textAngle);
                    wheelContainer.add(text);
                }

                // Strzałka
                const arrow = this.add.graphics({x: 279, y:279});
                arrow.fillStyle(0xB52DC8, 1);
                arrow.beginPath();
                arrow.moveTo(radius + 30, 15);
                arrow.lineTo(radius + 10, 0);
                arrow.lineTo(radius + 30, -15);
                arrow.closePath();
                arrow.fill();

                chosenName = this.add.text(this.cameras.main.centerX, 520, "", {
                    font: "24px Arial",
                    color: "#ffffff",
                    align: "center",
                });
                chosenName.setOrigin(0.5);

                canSpin = true;

                this.input.on("pointerdown", this.spin.bind(this));
            }

            spin() {
                if (canSpin) {
                    chosenName.setText("");
                    const rounds = Phaser.Math.Between(2, 6);
                    const degrees = Phaser.Math.Between(0, 360);
                    name = slices - 1 - Math.floor(degrees / (360 / slices));

                    this.tweens.add({
                        targets: wheelContainer,
                        angle: 360 * rounds + degrees,
                        duration: 3000,
                        ease: "Cubic.easeOut",
                        callbackScope: this,
                        onComplete: this.winner,
                    });
                }
            }

            winner() {
                canSpin = true;
                const currentAngle = wheelContainer.angle % 360;
                const normalizedAngle =
                    currentAngle < 0 ? currentAngle + 360 : currentAngle;
                const nameIndex =
                    slices - 1 - Math.floor(normalizedAngle / (360 / slices));
                chosenName.setText(slicesData[nameIndex]);
            }
        }

        // Inicjalizacja gry Phaser
        if (gameRef.current) {
            game = new Phaser.Game({
                type: Phaser.AUTO,
                width: 550, // Rozmiar sceny 
                height: 550,
                parent: gameRef.current,
                scene: [PlayGame],
            });
        }

        return () => {
            if (game) {
                game.destroy(true);
            }
        };
    }, [data]); // Zależność, aby gra była renderowana, gdy dane się zmienią

    return (
        <div ref={gameRef} style={{ width: "600px", height: "600px" }}></div>
    );
};

export default WheelGame;
