// Kudos: http://stackoverflow.com/a/10833393/197789

function onOpen() {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Archive', 'archive')
      .addToUi();
}

function archive() {
  var baseDoc = DocumentApp.getActiveDocument()
  var baseBody = baseDoc.getActiveSection();

  var targetUrl = getArchiveUrl(baseBody)
  if ( targetUrl == null) {
      throw new Error("No archive URL found.");
  }
  var targetDoc = DocumentApp.openByUrl(targetUrl)
  var targetBody = targetDoc.getActiveSection();

  preambleIndex = preambleEndIndex(baseBody)
  if ( preambleIndex == -1 ) {
    // No preamble, start at begining of document
    preambleIndex = 0
  }

  var totalElements = baseBody.getNumChildren();
  endIndex = prependToBody(baseBody, preambleIndex + 1, targetBody)
  targetBody.insertHorizontalRule(endIndex)

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

function appendToBody(srcBody, srcStartingIndex, targetBody) {
  var totalElements = srcBody.getNumChildren();
  for( var j = srcStartingIndex; j < totalElements; ++j ) {
    var child = srcBody.getChild(j);
    var element = child.copy();
    var type = element.getType();
    if( type == DocumentApp.ElementType.PARAGRAPH )
      targetBody.appendParagraph(element);
    else if( type == DocumentApp.ElementType.TABLE )
      targetBody.appendTable(element);
    else if( type == DocumentApp.ElementType.LIST_ITEM )
      targetBody.appendListItem(element);
    else
      throw new Error("Unknown element type: "+type);
  }
}

function prependToBody(srcBody, srcStartingIndex, targetBody) {
  var totalElements = srcBody.getNumChildren();
  var targetIndex = 0
  for( var j = srcStartingIndex; j < totalElements; ++j ) {
    var child = srcBody.getChild(j);
    var element = child.copy();
    var type = element.getType();
    if( type == DocumentApp.ElementType.PARAGRAPH )
      targetBody.insertParagraph(targetIndex, element);
    else if( type == DocumentApp.ElementType.TABLE )
      targetBody.insertTable(targetIndex, element);
    else if( type == DocumentApp.ElementType.LIST_ITEM )
      targetBody.insertListItem(targetIndex, element);
    else
      throw new Error("Unknown element type: "+type);
    targetIndex++;
  }
  return targetIndex;
}
