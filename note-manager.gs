// Kudos: http://stackoverflow.com/a/10833393/197789

function onOpen() {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Archive', 'archive')
      .addToUi();
}

function archive() {
  var baseDoc = DocumentApp.getActiveDocument()
  var baseBody = baseDoc.getActiveSection();
  var targetDoc = DocumentApp.openByUrl("https://docs.google.com/document/d/1GelPKmYV2EQLZ_lI-DEmrcONOvRph8cIFRZLV-JvW-M/edit")
  var targetBody = targetDoc.getActiveSection();

  targetBody.appendHorizontalRule()

  preambleIndex = preambleEndIndex(baseBody)
  if ( preambleIndex == -1 ) {
    // No preamble, start at begining of document
    preambleIndex = 0
  }

  var totalElements = baseBody.getNumChildren();
  for( var j = preambleIndex + 1; j < totalElements; ++j ) {
    var child = baseBody.getChild(j);
    var element = child.copy();
    var type = element.getType();
    if( type == DocumentApp.ElementType.PARAGRAPH )
      targetBody.appendParagraph(element);
    else if( type == DocumentApp.ElementType.TABLE )
      targetBody.appendTable(element);
    else if( type == DocumentApp.ElementType.LIST_ITEM )
      targetBody.appendListItem(element);
    else
      throw new Error("According to the doc this type couldn't appear in the body: "+type);
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