const iconPaths = {
    "science": "M200-120q-51 0-72.5-45.5T138-250l222-270v-240h-40q-17 0-28.5-11.5T280-800q0-17 11.5-28.5T320-840h320q17 0 28.5 11.5T680-800q0 17-11.5 28.5T640-760h-40v240l222 270q32 39 10.5 84.5T760-120H200Zm0-80h560L520-492v-268h-80v268L200-200Zm280-280Z",
    "scissors": "M760-120 480-400l-94 94q8 15 11 32t3 34q0 66-47 113T240-80q-66 0-113-47T80-240q0-66 47-113t113-47q17 0 34 3t32 11l94-94-94-94q-15 8-32 11t-34 3q-66 0-113-47T80-720q0-66 47-113t113-47q66 0 113 47t47 113q0 17-3 34t-11 32l494 494v40H760ZM600-520l-80-80 240-240h120v40L600-520ZM240-640q33 0 56.5-23.5T320-720q0-33-23.5-56.5T240-800q-33 0-56.5 23.5T160-720q0 33 23.5 56.5T240-640Zm240 180q8 0 14-6t6-14q0-8-6-14t-14-6q-8 0-14 6t-6 14q0 8 6 14t14 6ZM240-160q33 0 56.5-23.5T320-240q0-33-23.5-56.5T240-320q-33 0-56.5 23.5T160-240q0 33 23.5 56.5T240-160Z",
}

export function htmlIcon(name, size, scale)
{
    scale = scale ?? 1;
    let i = (scale - 1) * 960;
    return `<svg xmlns=http://www.w3.org/2000/svg" height="${size ?? 32}px" width="${size ?? 32}" viewBox="${i} ${-960+i} ${960-i*2} ${960-i*2}"><path d="${iconPaths[name]}"/></svg>`;
}

export function makeIcon(name, size, scale)
{
    scale = scale ?? 1;
    let i = (scale - 1) * 960;
    return {
        type: "svg",
        attr_width: size ?? 32,
        attr_height: size ?? 32,
        attr_viewBox: `${i} ${-960+i} ${960-i*2} ${960-i*2}`,
        attr_preserveAspectRatio: "xMidYMid slice",
        attr_role: "img",
        $: {
            type: "path",
            attr_d: iconPaths[name],
        }
    };
}

