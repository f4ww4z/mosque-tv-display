# if not run as root, run as root
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

source ~/.nvm/nvm.sh

rm -r node_modules
npm i
npm run build
systemctl restart mosque