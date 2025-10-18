import { Component, inject, input } from '@angular/core';
import { MinuteDataService } from '../minute-data.service';
import { FormsModule } from '@angular/forms';
import { AgendaDto, DecisionDto } from '../../../models/models';

@Component({
  selector: 'app-minute-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './minute-edit.component.html',
  styleUrl: './minute-edit.component.scss'
})
export class MinuteEditComponent {
  minuteDataService = inject(MinuteDataService);
  minuteData = this.minuteDataService.getMinuteData();
  count = -1;   //unique negative number which is assigned as the decision or agenda id which is used for deletion

  createEmptyAgenda() {
    const newAgenda = new AgendaDto();
    newAgenda.agendaId = this.count;
    this.count--;
    this.minuteData().agendas.push(newAgenda);
  }


  createEmptyDecision() {
    const newDecision = new DecisionDto();
    newDecision.decisionId = this.count;
    this.count--;
    this.minuteData().decisions.push(newDecision);
  }

  deleteAgenda(agendaId: number) {
    this.minuteData().agendas = this.minuteData().agendas.filter((agenda) => agenda.agendaId !== agendaId);
  }


  deleteDecision(decisionId: number) {
    this.minuteData().decisions = this.minuteData().decisions.filter((decision) => decision.decisionId !== decisionId);
  }
  onSubmit() {
    //when form is submitted, first remove the empty decision and agenda, as server won't accept those(probably, check later);
  }
}
