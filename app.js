'use strict';

class Display {
    constructor(runtime) {
        this.runtime = runtime;
        this.stageWidth = 480; // 舞台宽度
        this.stageHeight = 360; // 舞台高度
        this.scale = 1; // 缩放程度
        this.centerX = 0; // 视角中心x坐标
        this.centerY = 0; // 视角中心y坐标
        this.flipX = false; // 是否水平翻折
        this.prevFlipX = false; // 上一次是否水平翻折
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

        // 计算视角中心坐标
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

        // 设置缩放和视角中心
        this.runtime.setZoom(this.scale);
        this.runtime.setCenter(this.centerX, this.centerY);
    }

    flipStage() {
        this.prevFlipX = this.flipX;
        this.flipX = !this.flipX;
        this.runtime.setStageMirror(this.flipX, false);

        // 恢复视角中心坐标
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
