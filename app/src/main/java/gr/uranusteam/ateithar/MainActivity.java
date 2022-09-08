package gr.uranusteam.ateithar;


import android.app.AlertDialog;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageButton;
import android.widget.Toast;


import com.wikitude.architect.ArchitectView;
import com.wikitude.architect.StartupConfiguration;

import java.util.Locale;


public class MainActivity extends AppCompatActivity implements LocationListener  {

    private ArchitectView architectView;
    ImageButton FAB;
    int selectedCategory = 0;
    Location location = getLocation();


    // Declaring a Location Manager
    public LocationManager locationManager;
    boolean isGpsEnabled = false;


    // The minimum distance to change Updates in meters
    private static final long MIN_DISTANCE_FOR_UPDATES = 10; // 10 meters
    private static final long MIN_TIME_FOR_UPDATES = 30000; // 30 seconds




    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        location = getLocation(); //zhta topothesia

        if (!isGpsEnabled ){ //an den uparxei paroxos topothesias gps alert user
            showSettingsAlert();
        }

        try {
            if(location!=null){
                this.architectView = (ArchitectView)this.findViewById( R.id.architectView );
                final StartupConfiguration config = new StartupConfiguration( "NexRRUOhmpP7nnSQDIcB1FCvZ3JypR0bxu8p/rLEOyhGUJaNViYebZ0WugFGNwtgMWOsVJ0MaQbKjQX2coqkiA6bUrGSjxKf1PzTzKWa4xSVqqxM5FFTSkh1izyQMeaOCwR/jRD6lVxuwoG9RphipOFlbjdAUu6Y+kfyxpVz/W9TYWx0ZWRfXy7J5A6cgnV8Nd3DJm5inEIFoX+JQzGitqc/XE05TqHlPogo4832JpFhDPLKsaCYNDO3UTSvJrLkD8w00OnmcT0GFBJuq0XtX3xOsMM7UY9h64VidonalU3S1uj8PaEtt0sQ5Jy4ngsarW+hlLqwrk+QbR5C+Cn1I6we0rf0ENM5Mz4Bf/xqqL8F7E2vqOu0E1qafuGjw7k6wmp+mjS06os4mwguRvpceks+QrhRdCkmqSANyjDeA5I1XNzT391kfXFEArQyce2GZX1b/s6VJ8/2ec7kXx0UIECQn664LbbvtDautnTSyy2Fd5305Qq322fDC5g8VX2MQfpzfrY/lCbWcolf5JOn4r4B7mYqm4Ke5uD0pttnhPB5cNcENb0Cju2dCV30mDsYMGM7uIJiBlBrYzq0RobTFV7vMH8iByaFl2FnVkz56D5PZYuu+EaFJ/zliFrUc/ZGRK0eb9hp7ugNADjdI/6I9h9zA4PlAb+DUmQf7tSX7gY=" );
                this.architectView.onCreate( config );
                updateArchitect();
                Toast.makeText(getApplicationContext(), "LOCATION OXI NULL", Toast.LENGTH_SHORT).show();

            }
            else {
                this.architectView = (ArchitectView)this.findViewById( R.id.architectView );
                final StartupConfiguration config = new StartupConfiguration( "NexRRUOhmpP7nnSQDIcB1FCvZ3JypR0bxu8p/rLEOyhGUJaNViYebZ0WugFGNwtgMWOsVJ0MaQbKjQX2coqkiA6bUrGSjxKf1PzTzKWa4xSVqqxM5FFTSkh1izyQMeaOCwR/jRD6lVxuwoG9RphipOFlbjdAUu6Y+kfyxpVz/W9TYWx0ZWRfXy7J5A6cgnV8Nd3DJm5inEIFoX+JQzGitqc/XE05TqHlPogo4832JpFhDPLKsaCYNDO3UTSvJrLkD8w00OnmcT0GFBJuq0XtX3xOsMM7UY9h64VidonalU3S1uj8PaEtt0sQ5Jy4ngsarW+hlLqwrk+QbR5C+Cn1I6we0rf0ENM5Mz4Bf/xqqL8F7E2vqOu0E1qafuGjw7k6wmp+mjS06os4mwguRvpceks+QrhRdCkmqSANyjDeA5I1XNzT391kfXFEArQyce2GZX1b/s6VJ8/2ec7kXx0UIECQn664LbbvtDautnTSyy2Fd5305Qq322fDC5g8VX2MQfpzfrY/lCbWcolf5JOn4r4B7mYqm4Ke5uD0pttnhPB5cNcENb0Cju2dCV30mDsYMGM7uIJiBlBrYzq0RobTFV7vMH8iByaFl2FnVkz56D5PZYuu+EaFJ/zliFrUc/ZGRK0eb9hp7ugNADjdI/6I9h9zA4PlAb+DUmQf7tSX7gY=" );
                this.architectView.onCreate( config );
                Toast.makeText(getApplicationContext(), "LOCATION NULL", Toast.LENGTH_SHORT).show();

            }
        }

        catch(Exception ex) {
            Log.d("Error",ex.getMessage());
        }

        FAB = (ImageButton) findViewById(R.id.imageButton);
        FAB.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showOptionCategories();
            }
        });


        
    }


   // @SuppressWarnings("static-access")
    public Location getLocation() {
        Location loc= null;
        try {
            locationManager = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);


             if(locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)){
                 isGpsEnabled=true;
                    locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER,0,MIN_DISTANCE_FOR_UPDATES, this);

                    if (locationManager != null) {
                        loc = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                        this.architectView.setLocation(loc.getLatitude(),loc.getLongitude(),loc.getAltitude(),0);

                    }
                Toast.makeText(getApplicationContext(), "Gps"+loc.getLatitude()+" "+loc.getLongitude()+" "+loc.getAltitude(), Toast.LENGTH_SHORT).show();

            }

            }catch(Exception e){
                e.printStackTrace();
            }

        return loc;
    }


    public void showSettingsAlert() {

        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage(R.string.alert_message)
                .setCancelable(false)
                .setPositiveButton(R.string.btn_settings, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        startActivityForResult(new Intent(android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS), 0);

                    }
                })
                .setNegativeButton(R.string.btn_cancel, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        dialog.cancel();
                    }
                });
        AlertDialog alert = builder.create();
        alert.show();

    }

    public void showOptionCategories(){
        String all = getString(R.string.all);
        String dioik = getString(R.string.dioik);
        String sdo  = getString(R.string.sdo);
        String seyp = getString(R.string.seyp);
        String steg = getString(R.string.steg);
        String stef = getString(R.string.stef);

        CharSequence categories[] = new CharSequence[] {all, dioik, sdo, seyp, steg, stef};

        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(R.string.optionTitle);
        builder.setItems(categories, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                // the user clicked on categories[which]
                selectedCategory = which;
                if (location != null){
                    updateArchitect();
                }
            }
        });
        builder.show();
    }

    //method for calling architect updates
    public void updateArchitect(){
       // Toast.makeText(getApplicationContext(), "World.categorySelector("+String.valueOf(selectedCategory)+")", Toast.LENGTH_SHORT).show();
        String sc = String.valueOf(selectedCategory);
        this.architectView.callJavascript("World.categorySelector("+sc+")");
        this.architectView.setLocation(location.getLatitude(),location.getLongitude(),location.getAltitude(),0);
    }

    @Override
    public void onLocationChanged(Location loc) {
        location = loc;
        updateArchitect();
        Toast.makeText(getApplicationContext(), "!!!Location changed archUpdated!!! \n "+loc.getLatitude()+" "+loc.getLongitude()+" "+loc.getAltitude(), Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onProviderDisabled(String provider) {

        showSettingsAlert();
    }

    @Override
    public void onProviderEnabled(String provider) {
        location = getLocation();
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) { location = getLocation(); }

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        this.architectView.onPostCreate();
        try {

            this.architectView.load("index.html");
        }
        catch(Exception ex){

        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        this.architectView.onPause();
        locationManager.removeUpdates(this);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        this.architectView.onDestroy();
        locationManager.removeUpdates(this);

    }

    @Override
    protected void onResume() {
        super.onResume();
        this.architectView.onResume();
        location = getLocation();

    }

    public void onLowMemory() {
        super.onLowMemory();
        if ( this.architectView != null ) {
            this.architectView.onLowMemory();
        }
    }

    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.title_bar_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.action_help:

                AlertDialog.Builder alert = new AlertDialog.Builder(this);
                alert.setTitle(R.string.compassProb);

                WebView wv = new WebView(this);
                String locale = Locale.getDefault().getLanguage();
                if (locale.equals("el")){ wv.loadUrl("file:///android_asset/compass-el.html");}
                else { wv.loadUrl("file:///android_asset/compass.html");}

                wv.setWebViewClient(new WebViewClient() {
                    @Override
                    public boolean shouldOverrideUrlLoading(WebView view, String url) {
                        view.loadUrl(url);

                        return true;
                    }
                });

                alert.setView(wv);
                alert.setNegativeButton(R.string.close, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int id) {
                        dialog.dismiss();
                    }
                });
                alert.show();


            default:
                // If we got here, the user's action was not recognized.
                // Invoke the superclass to handle it.
                return super.onOptionsItemSelected(item);
        }

    }


}
