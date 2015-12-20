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

  preambleEndElement = baseBody.findElement(DocumentApp.ElementType.HORIZONTAL_RULE, null)
  if ( preambleEndElement == null) {
    preambleIndex = 0; // No preamble, start with top of document
  } else {
    preambleIndex = baseBody.getChildIndex(preambleEndElement.getElement().getParent())
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

function parsePreamble(body) {
  var totalElements = body.getNumChildren();
  for( var j = 0; j < totalElements; ++j ) {
    var child = body.getChild(j);
    if ( child.getType() == DocumentApp.ElementType.HORIZONTAL_RULE ) {
      return j;
    }
  }
  // No preamble
  return 0
}
