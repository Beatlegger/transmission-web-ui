import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TorrentListComponent } from './components/torrent-list/torrent-list.component';
import { TorrentListItemComponent } from './components/torrent-list/torrent-list-item/torrent-list-item.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BytePipe } from './pipes/byte.pipe';
import { FilterPipe } from './pipes/filter.pipe';

@NgModule({
  declarations: [
    ToolbarComponent,
    SidebarComponent,
    TorrentListComponent,
    TorrentListItemComponent,
    AppComponent,
    BytePipe,
    FilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }