// Globals

//----- on document ready -----//

$(document).ready(function() {
	$.get("http://localhost:8080/boards?name=board1")
	 .done(function(data) {
		 loadBoard(data);
	 })
	 .fail(function(data) {
		 $("#boardName").html( "kanban" );
	 })
	 .always(function() {
	 });
});


//----- Loading the board -----//

function loadBoard(data) {
	$("#boardName" ).html( data._embedded.boards[0].name );
	$("#teamName"  ).html( data._embedded.boards[0].team );
	$("#personName").html( data._embedded.boards[0].person );

	$.get(data._embedded.boards[0]._links.tasks.href)
	 .done(function(taskdata) {
		 var taskArray = taskdata._embedded.tasks;
		 taskArray.forEach(loadTask);
		 $('#taskTemplate').hide();

	 });
}

function loadTask(task, i) {
	 var name = task.name;
	 var desc = task.desc;
	 var tid  = "task-" + i;
	 var nid  = "taskName-" + i;
	 var did  = "taskDesc-" + i;

	 $('#taskTemplate').addClass("taskTy-bus")
 	  .clone()
		.attr('id', tid)
 	  .appendTo('#box1');

		$('#' + tid).find("textarea#taskName").val(name);
		$('#' + tid).find("textarea#taskDesc").val(desc);
}


//----- Drag and Drop functions -----//

function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
	ev.preventDefault();
	if ( ev.target.className == "box" || ev.target.className == "trash" ) {
		var data = ev.dataTransfer.getData("text");
		ev.target.appendChild(document.getElementById(data));
		$.post( "/kanban", { 'tasks': $('#tasks').html() } );
	}
}

function dropTrash(ev) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	var droppedDiv = document.getElementById(data);
	droppedDiv.style.display = 'none';
	ev.target.appendChild(droppedDiv);
}


//----- task functions -----//

function newTask(taskType) {
	$('#modalTask').addClass(taskType);
	$('#kanbanModal').show();
}

function canModalTask() {
	resetModalTask();
	$('#kanbanModal').hide();
}

function setModalTask() {
	var
	  taskNo = $('.task').length + 1,
	  taskId = "task-" + taskNo,
	  taskClass = $('[class^=taskTy-]');

	$('#modalTask')
	  .clone()
	  .attr('id', taskId)
	  .appendTo('#box1');

	$('#setTaskBtn').remove();
	$('#canTaskBtn').remove();

	resetModalTask();

	$('#kanbanModal').hide();
}

function resetModalTask() {
	$('#modalTask')
	   .attr('class', '[class=^taskTy-]')
	   .removeClass('[class=^taskTy-]')
	   .addClass('task')
	   .addClass('postit')
	   .addClass('handwritten');

	$('#modalTask').children('textarea').val('');
}
