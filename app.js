'use strict';

class Display {
    constructor(runtime) {
        this.runtime = runtime;
        this.stageWidth = 480; // ��̨���
        this.stageHeight = 360; // ��̨�߶�
        this.scale = 1; // ���ų̶�
        this.centerX = 0; // �ӽ�����x����
        this.centerY = 0; // �ӽ�����y����
        this.flipX = false; // �Ƿ�ˮƽ����
        this.prevFlipX = false; // ��һ���Ƿ�ˮƽ����
    }

    getInfo() {
        return {
            id: 'display',
            name: 'Display',
            blocks: [
                {
                    opcode: 'rotateStage',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'rotate stage by [ANGLE] degrees',
                    arguments: {
                        ANGLE: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 90,
                        },
                    },
                },
                {
                    opcode: 'scaleStage',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set stage scale to [SCALE] % and center at [CENTER]',
                    arguments: {
                        SCALE: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 100,
                        },
                        CENTER: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'center',
                            defaultValue: 'stage',
                        },
                    },
                },
                {
                    opcode: 'flipStage',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'flip stage horizontally',
                },
            ],
            menus: {
                center: ['stage', 'sprite'],
            },
        };
    }

    rotateStage(args) {
        const { ANGLE } = args;
        this.runtime.setStageRotation(this.runtime.getStage().rotation + ANGLE);
    }

    scaleStage(args) {
        const { SCALE, CENTER } = args;
        this.scale = SCALE / 100;

        // �����ӽ���������
        if (CENTER === 'stage') {
            this.centerX = this.stageWidth / 2;
            this.centerY = this.stageHeight / 2;
        } else {
            const targetId = this.runtime.getTargetForStage().sprite.id;
            const targetX = this.runtime.renderer.drawables[targetId].x;
            const targetY = this.runtime.renderer.drawables[targetId].y;
            this.centerX = targetX;
            this.centerY = targetY;
        }

        // �������ź��ӽ�����
        this.runtime.setZoom(this.scale);
        this.runtime.setCenter(this.centerX, this.centerY);
    }

    flipStage() {
        this.prevFlipX = this.flipX;
        this.flipX = !this.flipX;
        this.runtime.setStageMirror(this.flipX, false);

        // �ָ��ӽ���������
        if (this.flipX !== this.prevFlipX) {
            this.centerX = this.stageWidth - this.centerX;
        }
        this.runtime.setCenter(this.centerX, this.centerY);
    }

    _shutdown() { }

    _getStatus() {
        return { status: 2, msg: 'Ready' };
    }
}

Scratch.extensions.register(new Display());
