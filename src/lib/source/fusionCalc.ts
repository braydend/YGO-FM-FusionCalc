// var outputLeft = document.getElementById('outputarealeft');
// var outputRight = document.getElementById('outputarearight');

import { card_db } from '../data/cards';
import { equipsList } from '../data/equips';
import { fusionsList } from '../data/fusions';

// Initialize Awesomplete
// var _awesompleteOpts = {
//     list: card_db()
//         .get()
//         .map((c) => c.Name), // List is all the cards in the DB
//     autoFirst: true, // The first item in the list is selected
//     filter: Awesomplete.FILTER_STARTSWITH, // Case insensitive from start of word
// };
const handCompletions = {};
// for (i = 1; i <= 5; i++) {
//     var hand = document.getElementById("hand" + i);
//     handCompletions["hand" + i] = new Awesomplete(hand, _awesompleteOpts);
// }

// Creates a div for each fusion
// function fusesToHTML(fuselist) {
//     return fuselist
//         .map(function (fusion) {
//             var res =
//                 "<div class='result-div'>Input: " + fusion.card1.Name + "<br>Input: " + fusion.card2.Name;
//             if (fusion.result) {
//                 // Equips and Results don't have a result field
//                 res += "<br>Result: " + fusion.result.Name;
//                 if (isMonster(fusion.result)) {
//                     res += " " + formatStats(fusion.result.Attack, fusion.result.Defense);
//                 } else {
//                     res += " [" + cardTypes[fusion.result.Type] + "]";
//                 }
//             }
//             return res + "<br><br></div>";
//         })
//         .join("\n");
// }

function getCardByName(cardname: string) {
	return card_db.find(({ Name }) => Name.toLowerCase() === cardname.toLowerCase());
}

// Returns the card with a given ID
function getCardById(id: number) {
	const card = card_db.find(({ Id }) => Id === id);
	if (!card) {
		return null;
	}
	return card;
}

function formatStats(attack: string | number, defense: string | number) {
	return '(' + attack + '/' + defense + ')';
}

// Returns true if the given card is a monster, false if it is magic, ritual,
// trap or equip
function isMonster(card: { Type: number }) {
	return card.Type < 20;
}

// function checkCard(cardname: string, infoname: unknown) {
// 	const info = $('#' + infoname);
// 	const card = getCardByName(cardname);
// 	if (!card) {
// 		info.html('Invalid card name');
// 	} else if (isMonster(card)) {
// 		info.html(formatStats(card.Attack, card.Defense) + ' [' + cardTypes[card.Type] + ']');
// 	} else {
// 		info.html('[' + cardTypes[card.Type] + ']');
// 	}
// }

// Checks if the given card is in the list of fusions
// Assumes the given card is an Object with an "Id" field
// TODO: Generalize to take Object, Name (string) or Id (int)
function hasFusion(fusionList, card) {
	return fusionList.some((c) => c.Id === card.Id);
}

function getCardsInHand() {
	const cards = [];
	for (let i = 1; i <= 5; i++) {
		const name = $('#hand' + i).val();
		const card = getCardByName(name);
		if (card) {
			cards.push(card);
		}
	}

	return cards;
}

export function findFusions() {
	const cards = getCardsInHand();

	const fuses = [];
	const equips = [];

	for (let i = 0; i < cards.length - 1; i++) {
		const card1 = cards[i];
		const card1Fuses = fusionsList[card1.Id];
		const card1Equips = equipsList[card1.Id];
		for (let j = i + 1; j < cards.length; j++) {
			const card2 = cards[j];
			const fusion = card1Fuses.find((f) => f.card === card2.Id);
			if (fusion) {
				fuses.push({ card1: card1, card2: card2, result: getCardById(fusion.result) });
			}
			const equip = card1Equips.find((e) => e === card2.Id);
			if (equip) {
				equips.push({ card1: card1, card2: card2 });
			}
		}
	}

	return { fusions: fuses, equips };
}

// function renderFusions(fusions, equips) {
//     outputLeft.innerHTML = "<h2 class='center'>Fusions:</h2>";
//     outputLeft.innerHTML += fusesToHTML(fusions.sort((a, b) => b.result.Attack - a.result.Attack));

//     outputRight.innerHTML = "<h2 class='center'>Equips:</h2>";
//     outputRight.innerHTML += fusesToHTML(equips);
// }

// function resultsClear() {
//     outputLeft.innerHTML = "";
//     outputRight.innerHTML = "";
// }

// function inputsClear() {
//     for (i = 1; i <= 5; i++) {
//         $("#hand" + i).val("");
//         $("#hand" + i + "-info").html("");
//     }
// }

// Set up event listeners for each card input
for (let i = 1; i <= 5; i++) {
	$('#hand' + i).on('change', function () {
		handCompletions[this.id].select(); // select the currently highlighted element
		if (this.value === '') {
			// If the box is cleared, remove the card info
			$('#' + this.id + '-info').html('');
		} else {
			checkCard(this.value, this.id + '-info');
		}
		resultsClear();
		const { fusions, equips } = findFusions();
		renderFusions(fusions, equips);
	});

	$('#hand' + i).on('awesomplete-selectcomplete', function () {
		checkCard(this.value, this.id + '-info');
		resultsClear();
		const { fusions, equips } = findFusions();
		renderFusions(fusions, equips);
	});
}

// $("#resetBtn").on("click", function () {
//     resultsClear();
//     inputsClear();
// });
