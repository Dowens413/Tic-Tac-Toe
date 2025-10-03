

        function showPopup(message) {                                               //Popup function for the overlay    
            document.getElementById("popupContent").innerHTML = message;
            document.getElementById("popupOverlay").style.display = "flex";
        }

        function hidePopup() {
            document.getElementById("popupOverlay").style.display = "none";       //Hide popup function when  the x is click
        }

        const helpCell = document.getElementById("helpBox");
        helpCell.addEventListener("click", function (e) {
            e.preventDefault();      // help button  prompt
            showPopup(`Welcome to my tic tac toe website! It uses node.js web sockets connect users with the server.<br><br>
        Pick a screen name below to get started. If the name is currently in use you will be prompted to pick another one.<br><br>
        Next, there will be a list of games with player inside them. You are able to join the rooms that arent't full, or you can just create your own room and will
        be prompted to pick your status x or 0.<br><br> Once there are two player the game will start.<br><br> The game will end if a player disconects or when there's a Winner/Draw. `);

        });
function loginError(message)
	{
	document.getElementById("loginError").innerText = message;
	}
	function hideLogin()
	{
		document.getElementById("login-phase").style.display="none";
	}
	function showMenu(){
		document.getElementById("menu-phase").style.display="block";
	}
	function hideMenu()
	{
		document.getElementById("menu-phase").style.display="none";
	}
		function showGame(){
		document.getElementById("game-phase").style.display="block";
	}
	function hideGame()
	{
		document.getElementById("game-phase").style.display="none";
	}

    document.querySelectorAll('#tic-tac-toe-board td').forEach((cell) => {
  cell.addEventListener("click", function () {
    const cellNum = parseInt(cell.dataset.cellIndex); // 0–8
    if (cell.textContent !== "") return; // already taken

    if (yourTurn) {
      cell.textContent = yourSymbol; // 'X' or 'O'
      sendToServer("MOVE", {
        screenName: screenName,
        cell: cellNum
      });
      yourTurn = false; // disable until move comes back
    } else {
      showPopup("Not your turn!");
    }
  });
});

function checkGameOver() {
  const cells = Array.from(document.querySelectorAll('#tic-tac-toe-board td')).map(td => td.textContent);

  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diags
  ];

  for (let pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (cells[a] && cells[a] === cells[b] && cells[b] === cells[c]) {
      return cells[a]; // 'X' or 'O'
    }
  }

  if (cells.every(cell => cell !== "")) {
    return 'D'; // Draw
  }

  return null;
}





