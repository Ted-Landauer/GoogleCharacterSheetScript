function populateBonuses() {
  //get the body of the character sheet
  var characterSheetBody = DocumentApp.getActiveDocument().getBody();

  //get a list of the tables in the character sheet
  var tables = characterSheetBody.getTables();

  //all the tables
  var featureTable = tables[0];
  var abilityTable = tables[1];
  var skillsTable = tables[2];
  var attackTable = tables[3];
  var hpApMpTable = tables[4];
  var levelUpTable = tables[5];

//----------------------------------------------------------------------------//

  //get the character's level from the first table on the sheet
  var characterLevel = featureTable.getCell(0,5).getText().split(" ")[1];

  //gather the bonuses that ability scores give
  var bonusArray = getBonuses(abilityTable);

  //loop over the bonus values so that we only have to run a string split once rather than in multiple areas
  var bonusValues = [];
  for(var i = 0; i < bonusArray.length; i++) {

    bonusValues.push(parseInt(bonusArray[i].getText().split("/")[2]));

  }

  //Logger.log(bonusValues[0])

  //calculate the save bonus based off of the ability bonus and character level
  var savesArray = calculateSaves(bonusValues, characterLevel);

  //add the calculated save bonus value to the character sheet
  populateSaveBonuses(abilityTable, savesArray);

//----------------------------------------------------------------------------//

  //populate skills with their correct ability bonuses
  skillsTableBonuses(skillsTable, bonusValues);

//----------------------------------------------------------------------------//

  //populate the skills table with their bonuses
  calculateTotalSkillBonus(skillsTable);

//----------------------------------------------------------------------------//

  //Scratched as this waas determined to be of little importance and easy enough for the player to keep track of themselves
  //populate the attack table with the correct info
  //calculateAttackBonuses(attackTable);

  //print stuff out to test with
  //Logger.log("test");

}

//============================================================================//

//collects the values for the ability score bonues
function getBonuses(abilityScoreTable) {

  //initializations
  this.abilityScoreTable = abilityScoreTable;

  var bonuses = [];
  var j = 0;
  var k = 1;

  //loop over the cells and get the ones for the ability score bonuses
  for(var i = 0; i < 6; i++) {

    //populate array with the needed ability score bonus cells
    bonuses.push(this.abilityScoreTable.getCell(j,k));

    //increments for the looping
    k += 3;
    if (i == 2) {
      j++;
      k = 1;
    }

  }

  //return the array of the ability score bonus cells
  return bonuses;

}

//============================================================================//

//calculates the save bonus value without accounting for magic item bonuses
function calculateSaves (abilityBonusValuesArray, levelValue) {

  //initializations
  this.abilityBonusValuesArray = abilityBonusValuesArray;
  this.levelValue = levelValue;

  var saveValues = [];
  
  //loop over the array of save bonuses, calculate the total save bonus, and store the values in an array
  for(var i = 0; i < this.abilityBonusValuesArray.length; i++) {

    saveValues.push(parseInt(this.abilityBonusValuesArray[i]) + (Math.floor(this.levelValue/2)));

  }

  //return the array of the total save bonus for each ability score
  return saveValues;

}

//============================================================================//

//iterate over previously gathered data and fill the save bonus section of the character sheet
function populateSaveBonuses(abilityScoreTable, saveBonuses) {

  //style definitions so that things can be the same size,font, and allignment as before
  var style = {};
  style[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
  style[DocumentApp.Attribute.VERTICAL_ALIGNMENT] = DocumentApp.VerticalAlignment.CENTER;
  style[DocumentApp.Attribute.FONT_FAMILY] = 'Calibri';
  style[DocumentApp.Attribute.FONT_SIZE] = 8;

  //initializations
  this.abilityScoreTable = abilityScoreTable;
  this.saveBonuses = saveBonuses;

  var j = 0;
  var k = 2;

  //loop over the save bonuses data
  for (var i = 0; i < this.saveBonuses.length; i++) {
    
    //set the value in the correct cell of the character sheet
    this.abilityScoreTable.getCell(j,k).setText("Save Bonus\nMagic + " + saveBonuses[i]).setAttributes(style);

    //increments for the looping
    k += 3;
    if (i == 2) {
      j++;
      k = 2;
    }

  }

}

//============================================================================//

//iterates over all the entries in the skill bonus table and sets the correct bonus values according to the associated ability score
function skillsTableBonuses(skillsTable, abilityBonusArray) {

  //initializations
  this.skillsTable = skillsTable;
  this.abilityBonusArray = abilityBonusArray;

  var j = 0;
  var k = 2;

  //loop over the whole skills table
  for(var i = 0; i < 34; i++) {

    //if a cell contains the word ability then just skip it
    if(this.skillsTable.getCell(j,k).getText().includes("Ability")){

      j++;
      continue;
    }

    //placeholder variable for storing the pre-existing values in the specific cell of the table
    var tempBonuses = [];

    //check if a specific ability is found in the cirrent cell (STR,DEX,CON,INT,WIS,CHA)
    if(this.skillsTable.getCell(j,k).getText().includes("STR")) {

      //split and store the existing values
      tempBonuses = this.skillsTable.getCell(j,k).getText().split("+");

      //update the current cell with the preexisting values
      this.skillsTable.getCell(j,k).setText("+ " + abilityBonusArray[0] + " STR +" + tempBonuses[2] + "+" + tempBonuses[3] + "+" + tempBonuses[4]);

    }
    //THE FOLLOWING ELSE IF STATEMENTS ARE BASED OFF OF THE ABOVE IF BLOCK. FURTHER COMMENTS HAVE BEEN OMITTED FOR BREVITY AS THEY DO THE SAME THING JUST ON DIFFERENT ABILITY TRIGGERS
    else if(this.skillsTable.getCell(j,k).getText().includes("DEX")) {

      tempBonuses = this.skillsTable.getCell(j,k).getText().split("+");
      this.skillsTable.getCell(j,k).setText("+ " + abilityBonusArray[1] + " DEX +" + tempBonuses[2] + "+" + tempBonuses[3] + "+" + tempBonuses[4]);

    }
    else if(this.skillsTable.getCell(j,k).getText().includes("CON")) {

      tempBonuses = this.skillsTable.getCell(j,k).getText().split("+");
      this.skillsTable.getCell(j,k).setText("+ " + abilityBonusArray[2] + " CON +" + tempBonuses[2] + "+" + tempBonuses[3] + "+" + tempBonuses[4]);

    }
    else if(this.skillsTable.getCell(j,k).getText().includes("INT")) {

      tempBonuses = this.skillsTable.getCell(j,k).getText().split("+");
      this.skillsTable.getCell(j,k).setText("+ " + abilityBonusArray[3] + " INT +" + tempBonuses[2] + "+" + tempBonuses[3] + "+" + tempBonuses[4]);

    }
    else if(this.skillsTable.getCell(j,k).getText().includes("WIS")) {

      tempBonuses = this.skillsTable.getCell(j,k).getText().split("+");
      this.skillsTable.getCell(j,k).setText("+ " + abilityBonusArray[4] + " WIS +" + tempBonuses[2] + "+" + tempBonuses[3] + "+" + tempBonuses[4]);

    }
    else if(this.skillsTable.getCell(j,k).getText().includes("CHA")) {

      tempBonuses = this.skillsTable.getCell(j,k).getText().split("+");
      this.skillsTable.getCell(j,k).setText("+ " + abilityBonusArray[5] + " CHA +" + tempBonuses[2] + "+" + tempBonuses[3] + "+" + tempBonuses[4]);

    }

    //Increment and reset to the top rows when we need to get to the other side of the table
    j++;

    if(i == 16) {
      k = 7;
      j = 0;
    }

  }

}

//============================================================================//

//Calculate the total skill bonus for each skill
function calculateTotalSkillBonus(skillsTable) {

  //initializations
  this.skillsTable = skillsTable;

  //row to move down
  var j = 0;
  //position of the ability/equipment/etc bonuses
  var k = 2;
  //position of the skill level field
  var l = 1;
  //posistion of the total bonus field
  var m = 4;

  //iterate over the skill table
  for(var i = 0; i < 34; i++) {

    //placeholder variables needed for each pass through the loop
    var skill = 0;
    var totalBonus = 0;

    //If the current cell contains Ability skip over it
    if(this.skillsTable.getCell(j,k).getText().includes("Ability")){

      j++;
      continue;

    }

    //check if the cell we are looking at contains a string or an int. If it contains an int then we are good to continue
    if(!isNaN(parseInt(this.skillsTable.getCell(j,l).getText()))) {

      skill = parseInt(this.skillsTable.getCell(j,l).getText());

    }

    //calculate the total bonus based off of theskill level and the ability/equipment/etc. bonuses
    totalBonus = skill + calculateSkillAbilityBonus(this.skillsTable.getCell(j,k));

    //set the text in the total bonus cell to the total bonus
    this.skillsTable.getCell(j,m).setText(totalBonus);

    //increment and reset (when we need to get to the other side of the table)
    j++;

    if(i == 16) {
      
      j = 0;

      k = 7;
      l = 6;
      m = 9;

    }

  }

}

//============================================================================//

//calculates the bonuses from the accumulation of ability/equipment/other/etc. bonuses
function calculateSkillAbilityBonus(skillsTableCell) {

  //initializations
  this.skillsTableCell = skillsTableCell;

  var skillsCellValues = this.skillsTableCell.getText().split("+");

  var ability = parseInt(skillsCellValues[1]);
  var equip = 0;
  var magic = 0;
  var other = 0;

  //iterate over the individual items in the ability/equip/etc. cell
  for(var i = 0; i < 5; i++) {

    //check if the individual value we are looking at is a string or and int. If it is a string we skip it otherwise continue on
    if(isNaN(parseInt(skillsCellValues[i]))) {

      continue;

    }
    else {

      //gets the values for each of the non ability score bonus positions and sets them
      if(i == 2) {

        equip = parseInt(skillsCellValues[i]);

      }
      else if(i == 3) {

        magic = parseInt(skillsCellValues[i]);

      }
      else if(i == 4) {

        other = parseInt(skillsCellValues[i]);

      }

    }

  }

  //calculate the whole bonus for the individual cell
  var bonusFromAbilities = ability + equip + magic + other;

  //return an int of the total bonus without the skill level accounted for
  return bonusFromAbilities;

}

//============================================================================//




