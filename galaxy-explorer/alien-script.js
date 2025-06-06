const head = document.querySelector('.alien-head');
const eyes = document.querySelector('.alien-eyes');
const body = document.querySelector('.alien-body');
const accessory = document.querySelector('.alien-accessory');

document.getElementById('headSelect').addEventListener('change', (e) => {
  const shape = e.target.value;
  if (shape === 'round') {
    head.style.borderRadius = '50%';
  } else if (shape === 'triangular') {
    head.style.borderRadius = '0';
    head.style.clipPath = 'polygon(50% 0%, 100% 100%, 0% 100%)';
  } else {
    head.style.borderRadius = '50%';
    head.style.clipPath = 'none';
    head.style.backgroundImage = 'url("assets/antenna.png")';
    head.style.backgroundSize = 'cover';
  }
});

document.getElementById('eyeSelect').addEventListener('change', (e) => {
  const style = e.target.value;
  if (style === 'big') {
    eyes.style.width = '40px';
    eyes.style.height = '20px';
  } else if (style === 'tiny') {
    eyes.style.width = '20px';
    eyes.style.height = '10px';
  } else {
    eyes.style.boxShadow = '0 0 10px #0ff';
  }
});

document.getElementById('colorPicker').addEventListener('input', (e) => {
  body.style.backgroundColor = e.target.value;
});

document.getElementById('accessorySelect').addEventListener('change', (e) => {
  const item = e.target.value;
  accessory.innerHTML = '';
  if (item === 'hat') {
    accessory.style.background = 'url("assets/hat.png") no-repeat center/contain';
  } else if (item === 'glasses') {
    accessory.style.background = 'url("assets/glasses.png") no-repeat center/contain';
  } else if (item === 'cape') {
    accessory.style.background = 'url("assets/cape.png") no-repeat center/contain';
  } else {
    accessory.style.background = 'none';
  }
});

document.getElementById('downloadAlien').addEventListener('click', () => {
  html2canvas(document.getElementById('alienPreview')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'my-alien.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});
