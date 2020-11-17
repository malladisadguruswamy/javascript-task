	// Table Record Fetching 
	function table_data(){
		fetch('https://jsonplaceholder.typicode.com/posts')
	  	.then(response => {
	         response.json().then(t => {
	         	var tr = '';
	           	$.each(t, function(key, val) {
	           		tr += '<tr id="r_'+val.id+'">';
	           		tr += '<td><input type="checkbox" id="'+val.id+'" value="'+val.id+'" name="val_'+val.id+'" class="check check_'+val.userId+'" id="row_'+val.userId+'" ></td>';
	           		tr += '<td>'+val.id+'</td>';
	           		tr += '<td>'+val.title+'</td>';
	           		tr += '<td>'+val.body+'</td>';
	           		tr += '</tr>';
	        	});
	        	document.getElementById("demo").innerHTML = tr;
	        	//document.getElementById('t2').innerHTML(tr);
	         })
	       }).catch(err => {
	         console.log("ERROR: " + err);
	     });
	}
	window.onload = function() {
	  table_data();

	};
     // Add , Update Form Submition 
     $('#data_form').on('submit', function(e) {
	    var form = $(this);
	    var title = form.find('input[name="title"]').val();
	    var body = form.find('textarea[name="Description"]').val();
	    var mform = form.find('input[name="form"]').val();
	    var update_id = form.find('input[name="update"]').val(); 
	    var userId = form.find('input[name="userId"]').val(); 
	    if(mform == 'add'){
	    	fetch('https://jsonplaceholder.typicode.com/posts', {
			method: 'POST',
			body: JSON.stringify({
			    title: title,
			    body: body,
			    userId: 1,
			  }),
			  headers: {
			    'Content-type': 'application/json; charset=UTF-8',
			  },
			})
			.then((response) => response.json())
			.then((json) => console.log(json));
			// closing form 
			$('#sucss_message').html('Data inserted Successfully');
			// refreshing Form data
			$('#data_form')[0].reset();
			setTimeout(function() {$('#sucss_message').html(''); modal.style.display = "none";}, 2000);
			table_data();
	    }else if(mform == 'update'){
	    	fetch('https://jsonplaceholder.typicode.com/posts/'+update_id, {
			method: 'PUT',
			body: JSON.stringify({
			    id: update_id,
			    title: title,
			    body: body,
			    userId: userId,
			  }),
			  headers: {
			    'Content-type': 'application/json; charset=UTF-8',
			  },
			})
			.then((response) => response.json())
			.then((json) => console.log(json));
			$('#sucss_message').html('Data Updated Successfully');
			$('#data_form')[0].reset();
			setTimeout(function() {$('#sucss_message').html(''); modal.style.display = "none";}, 2000);
			table_data();
	    }
	    
	    e.preventDefault();
	    return false;
	});

	// Add Edit modal code
	var modal = document.getElementById("myModal");
	var btn = document.getElementById("myBtnadd");
	var span = document.getElementsByClassName("close")[0];
	btn.onclick = function() {
	  $('#btn_name').text('Submit');
	  $('#h1_name').text('Submit Details');
	  $('#form').val('add');
	  modal.style.display = "block";
	}
	span.onclick = function() {
	  modal.style.display = "none";
	}
	window.onclick = function(event) {
	  if (event.target == modal) {
	    modal.style.display = "none";
	  }
	}
	// Edit record code here code 
	$('.edit').on('click', function(e) {
	    var id = $(this).attr('name');
	    fetch('https://jsonplaceholder.typicode.com/posts/'+id)
		.then((response) => {
	         response.json().then(t => {
	         	$('#title').val(t.title);
	         	$('#update').val(t.id);
	         	$('#Description').val(t.body);
	         	$('#userId').val(t.userId);
	         	$('#btn_name').text('Update');
	         	$('#h1_name').text('Update Details');
	         	$('#form').val('update');
	         	modal.style.display = "block";
	         })
	       }).catch(err => {
	         console.log("ERROR: " + err);
	     });
		
	    e.preventDefault();
	    return false;
	});

	// Delete record code here
	$('.delet').on('click', function(e) {
	    var x = get_checkbox_ids();
	    $.each(x, function(key, val) {
	    	fetch('https://jsonplaceholder.typicode.com/posts/'+val, {
			  method: 'DELETE',
			});
			$('#r_'+val).remove();
			var x = document.getElementById("snackbar");
			 x.className = "show";
			setTimeout(function() {  x.className = x.className.replace("show", "");}, 1000);
        });
	    
	    e.preventDefault();
	    return false;
	});

	// on clicking function for check boxes 
	$(document).on("change", "input[class^=check]", function (event) {
		var id = $(this).attr('id');
		var x = get_checkbox_ids();
    	if(x.length !=0){
    		if(x.length <= 1  ){
    			$('.edit').removeAttr('disabled');
    			$('.delet').attr('disabled','disabled');
    			$('.edit').attr('name',x);
	    	}else{
	    		$('.edit').attr('disabled','disabled');
	    		$('.delet').removeAttr('disabled');
	    	}
    	}
    	
	});

	// getting all checkboxes list here
	function get_checkbox_ids(){
		var x = [];
		$('input[class^=check]').each(function(){
        	if($(this).prop("checked") == true){
            	x.push($(this).val());
        	}
    	});
    	return x;
	}


	// pagination code start here
	function pagination(){
		var total    = $('tbody > tr').length;
		var position = $('tbody').data('position');
		var jump     = $('tbody').data('jump');
		var paginate = function(position, jump) {
		    /* Show Default Items */
		    $('tbody > tr').each(function() {
		        /* Variable Defaults */
		        var index = $(this).index();

		        /* Condition */
		        var condition = (index >= position) && (index < position + jump);

		        /* Hide/Show Item */
		        $(this).toggle(condition);

		        /* Set Disabled Status */
		        $('.less').prop('disabled', (position - jump) < 0);
		        $('.more').prop('disabled', (position + jump) >= total);
		    });
		};

		/* Set Default Text */
		$('.count').text(jump);

		/* Init Paginate */
		paginate(position, jump);

		/* Bind Click Events to "Less" and "More" Button */
		$('.less, .more').on('click', function() {
		    /* Decrease/Increase Position */
		    position = $(this).hasClass('less') ? $('tbody').data('position') - jump : $('tbody').data('position') + jump;

		    /* Paginate */
		    paginate(position, jump);

		    /* Update Position */
		    $('tbody').data('position', position);
		});
	}
	// after loading pagination setting here
	setTimeout(function() {  pagination();}, 1500);