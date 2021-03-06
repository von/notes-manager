// Notes Manager Google Docs Add-on
// https://github.com/von/notes-manager
// Version 0.5
// License: https://creativecommons.org/licenses/by/4.0/

function onOpen() {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Archive', 'archive')
      .addItem('Delete Body', 'deleteBody')
      .addItem('Insert Template', 'insertTemplate')
      .addToUi();
}

function archive() {
  var baseDoc = DocumentApp.getActiveDocument()
  var baseBody = baseDoc.getActiveSection();

  preambleIndex = preambleEndIndex(baseBody)
  if ( preambleIndex == -1 ) {
    // No preamble, start at begining of document
    preambleIndex = 0
  }

  var targetUrl = getArchiveUrl(baseBody)
  if ( targetUrl == null) {
      throw new Error("No archive URL found.");
  }
  var targetDoc = DocumentApp.openByUrl(targetUrl)
  var targetBody = targetDoc.getActiveSection();

  targetIndex = preambleEndIndex(targetBody)
  if ( targetIndex == -1 ) {
    // No preamble, start at begining of document
    targetIndex = 0
  }

  endIndex = prependToBody(baseBody, preambleIndex + 1, targetBody, targetIndex + 1)
  targetBody.insertHorizontalRule(endIndex)
}

function insertTemplate() {
  var baseDoc = DocumentApp.getActiveDocument()
  var baseBody = baseDoc.getActiveSection();

  var templateUrl = getTemplateUrl(baseBody)
  if ( templateUrl == null) {
      throw new Error("No template URL found.");
  }
  var templateDoc = DocumentApp.openByUrl(templateUrl)
  var templateBody = templateDoc.getActiveSection();

  appendToBody(templateBody, 0, baseBody)
}

function deleteBody() {
  var baseDoc = DocumentApp.getActiveDocument()
  var baseBody = baseDoc.getActiveSection();

  var totalElements = baseBody.getNumChildren();
  var preambleIndex = preambleEndIndex(baseBody)
  if ( preambleIndex == -1 ) {
    // No preamble, start at begining of document
    preambleIndex = 0
  }

  // Cannot delete last element, so clear it intead
  baseBody.getChild(totalElements - 1).clear()
  for( var j = totalElements - 2; j > preambleIndex; --j ) {
    var child = baseBody.getChild(j);
    baseBody.removeChild(child);
  }
}


function preambleEndIndex(body) {
  preambleEndElement = body.findElement(
      DocumentApp.ElementType.HORIZONTAL_RULE,
      null)
  if ( preambleEndElement == null) {
    return -1; // No preamble
  }
  return body.getChildIndex(preambleEndElement.getElement().getParent())
}

function getArchiveUrl(body) {
  archiveElement = body.findText("Notes Archive")
  textObj = archiveElement.getElement().editAsText()
  return textObj.getLinkUrl(archiveElement.getStartOffset())
}

function getTemplateUrl(body) {
  archiveElement = body.findText("Notes Template")
  textObj = archiveElement.getElement().editAsText()
  return textObj.getLinkUrl(archiveElement.getStartOffset())
}

// Kudos: http://stackoverflow.com/a/10833393/197789
function appendToBody(srcBody, srcStartingIndex, targetBody) {
  var totalElements = srcBody.getNumChildren();
  // Array mapping List Ids to temporary list items to ensure
  // unique list Ids.
  // Kudos: http://stackoverflow.com/a/37278889/197789
  var listItemDictionary = {};
  for( var j = srcStartingIndex; j < totalElements; ++j ) {
    var child = srcBody.getChild(j);
    var element = child.copy();
    var type = element.getType();
    if( type == DocumentApp.ElementType.PARAGRAPH )
      targetBody.appendParagraph(element);
    else if( type == DocumentApp.ElementType.TABLE )
      targetBody.appendTable(element);
    else if( type == DocumentApp.ElementType.LIST_ITEM ) {
      newItem = targetBody.appendListItem(element);
      newItem.setNestingLevel(child.getNestingLevel());
      newItem.setGlyphType(child.getGlyphType());
      // Make sure new list item has a unique Id in the document by
      // creating a new list item for each list we copy in and using
      // the new item's Id.
      newItemId = newItem.getListId()
      if (listItemDictionary[newItemId] == null) {
        // First time we have seen this list, create a new Id
        // Saving item so we don't reuse id.
        var tempItem = targetBody.appendListItem("temp")
        listItemDictionary[newItemId] = tempItem;
      }
      newItem.setListId(listItemDictionary[newItemId])
    } else
      throw new Error("Unknown element type: "+type);
  }
  // Clean up temporary list Ids
  if(listItemDictionary){
    targetBody.appendParagraph("");
    for(var key in listItemDictionary){
      listItemDictionary[key].clear().removeFromParent()
    }
  }
}

function prependToBody(srcBody, srcStartingIndex, targetBody, targetIndex) {
  var totalElements = srcBody.getNumChildren();
  // Array mapping List Ids to temporary list items to ensure
  // unique list Ids.
  // Kudos: http://stackoverflow.com/a/37278889/197789
  var listItemDictionary = {};
  for( var j = srcStartingIndex; j < totalElements; ++j ) {
    var child = srcBody.getChild(j);
    var element = child.copy();
    var type = element.getType();
    if( type == DocumentApp.ElementType.PARAGRAPH )
      targetBody.insertParagraph(targetIndex, element);
    else if( type == DocumentApp.ElementType.TABLE )
      targetBody.insertTable(targetIndex, element);
    else if( type == DocumentApp.ElementType.LIST_ITEM ) {
      newItem = targetBody.insertListItem(targetIndex, element);
      newItem.setNestingLevel(child.getNestingLevel());
      newItem.setGlyphType(child.getGlyphType());
      // Make sure new list item has a unique Id in the document by
      // creating a new list item for each list we copy in and using
      // the new item's Id.
      newItemId = newItem.getListId()
      if (listItemDictionary[newItemId] == null) {
        // First time we have seen this list, create a new Id
        // Saving item so we don't reuse id.
        var tempItem = targetBody.appendListItem("temp")
        listItemDictionary[newItemId] = tempItem;
      }
      newItem.setListId(listItemDictionary[newItemId])
    } else
      throw new Error("Unknown element type: "+type);
    targetIndex++;
  }
  // Clean up temporary list Ids
  if(listItemDictionary){
    targetBody.appendParagraph("");
    for(var key in listItemDictionary){
      listItemDictionary[key].clear().removeFromParent()
    }
  }
  return targetIndex;
}
